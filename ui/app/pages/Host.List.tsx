import React, { useMemo } from 'react';
import { ResultRecord } from '@dynatrace-sdk/client-query';
import { Flex } from '@dynatrace/strato-components/layouts';
import { ProgressCircle } from '@dynatrace/strato-components/content';
import { IntentButton } from '@dynatrace/strato-components/buttons';
import { convertToTimeseries } from '@dynatrace/strato-components-preview/conversion-utilities';
import { TitleBar } from '@dynatrace/strato-components-preview/layouts';
import { DataTableV2, DataTableV2ColumnDef } from '@dynatrace/strato-components-preview/tables';
import { useDql } from '@dynatrace-sdk/react-hooks';
import { CPU_USAGE_QUERY, getHostAvgCpuQuery, getHostCpuUsageQuery } from '../queries';
import Colors from '@dynatrace/strato-design-tokens/colors';

type HostData = {
  hostId: string;
  hostName: string;
  idle: number;
  ioWait: number;
  other: number;
  steal: number;
  system: number;
  user: number;
};

export const HostList = () => {
  const result = useDql({
    query: CPU_USAGE_QUERY,
  });

  const columns = useMemo<DataTableV2ColumnDef<ResultRecord | null>[]>(
    () => [
      {
        id: 'hostId',
        header: 'Host ID',
        accessor: 'hostId',
        width: 'content',
      },
      {
        id: 'hostName',
        header: 'HostName',
        accessor: 'hostName',
        width: 'content',
      },
      {
        id: 'cpuUsage',
        header: 'CPU Usage',
        columnType: 'meterbar',
        accessor: ({ idle, ioWait, user, system, steal, other }: HostData) => [
          { name: 'CPU idle', value: idle },
          { name: 'I/O wait', value: ioWait },
          { name: 'CPU user', value: user },
          { name: 'CPU system', value: system },
          { name: 'CPU steal', value: steal },
          { name: 'CPU other', value: other },
        ],
        config: {
          showTooltip: true,
        },
        width: '1fr',
      },
      {
        id: 'cpuAvg',
        header: 'Average CPU %',
        columnType: 'sparkline',
        accessor: (row) => (result.data ? convertToTimeseries([row], result.data.types) : []),
        config: {
          color: Colors.Charts.Rainbow.Magenta.Default,
        },
        width: '1fr',
      },
    ],
    [result],
  );

  return (
    <Flex width="100%" flexDirection="column" justifyContent="center" gap={16}>
      <TitleBar>
        <TitleBar.Title>Hosts Insights</TitleBar.Title>
      </TitleBar>
      {result.isLoading && <ProgressCircle />}
      {result.data && (
        <DataTableV2 data={result.data.records} columns={columns} fullWidth>
          <DataTableV2.RowActions>
            {(row: HostData) => (
              <IntentButton
                payload={{
                  'dt.elements': [
                    {
                      'dt.markdown': `# Host ${row?.hostName} insights`,
                    },
                    {
                      'dt.query': getHostCpuUsageQuery(row?.hostId),
                      'visualization': 'areaChart',
                    },
                    {
                      'dt.query': getHostAvgCpuQuery(row?.hostId),
                    },
                  ],
                }}
              />
            )}
          </DataTableV2.RowActions>
          <DataTableV2.Pagination />
        </DataTableV2>
      )}
    </Flex>
  );
};