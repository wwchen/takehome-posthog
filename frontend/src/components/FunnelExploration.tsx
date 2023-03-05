import { Card, Select } from 'antd'
import { useActions, useValues } from 'kea'

import { ArrowDownOutlined } from '@ant-design/icons'
import { eventFunnelLogic } from 'scenes/eventFunnelLogic'

export function FunnelExploration(): JSX.Element {
  const { setPath, filterForUserIds } = useActions(eventFunnelLogic)
  const { path, results } = useValues(eventFunnelLogic)

  function onSelect(stepIndex: number, optionValue?: string) {
    const isClear = !optionValue
    const isNextStep = !!optionValue && optionValue !== 'dropoff'
    const isDropOff = optionValue && optionValue === 'dropoff'

    const currPath = path.slice(0, stepIndex)
    const step = results[stepIndex]

    if (isClear) {
      const pathStr = currPath.join(' > ')
      filterForUserIds(pathStr, step.matchingUserIds)
      setPath(currPath)
    } else if (isNextStep) {
      const nextPath = currPath.concat(optionValue)
      const pathStr = nextPath.join(' > ')
      const nextStepIndex = step.nextSteps.map((s) => s.title).indexOf(optionValue)
      filterForUserIds(pathStr, step.nextSteps[nextStepIndex].matchingUserIds)
      setPath(nextPath)
    } else if (isDropOff) {
      const pathStr = currPath.concat(optionValue).join(' > ')
      filterForUserIds(pathStr, step.dropoffUserIds)
      setPath(currPath)
    }
  }

  return (
    <>
      <Card title="Event walkthrough">
        <h3>Choose your own adventure</h3>
        {results.map((step, i) => (
          <>
            ({step.totalCount} users) <br />
            <ArrowDownOutlined /> <br />
            <Select
              defaultValue={'Select'}
              value={path[i]}
              // defaultOpen={true}
              allowClear={true}
              style={{ width: '20em' }}
              key={`${step.title}:${i}:${results.length}`}
              onSelect={(title) => onSelect(i, title)}
              onClear={() => onSelect(i)}
              options={[
                ...step.nextSteps.map((nextStep) => ({
                  value: nextStep.title,
                  label:
                    i === results.length - 1 || path[i] !== nextStep.title
                      ? `${nextStep.title} (${nextStep.totalCount} users left)`
                      : nextStep.title,
                })),
                ...(step.dropoffCount
                  ? [
                      {
                        value: 'dropoff',
                        label: `droped off (${step.dropoffCount} users left)`,
                      },
                    ]
                  : []),
              ]}
            />
            {i < results.length - 1 && (
              <>
                <br />
                <ArrowDownOutlined />
                <br />
              </>
            )}
          </>
        ))}
      </Card>

      {/* v1 flow, less inutitive */}
      {/* <Row>
        {results.map((step, i) => {
          return (
            <Col key={i}>
              <Card title={`Step ${i + 1}`}>
                <Radio.Group onChange={(e) => onClick(i, e.target.value)} buttonStyle="outline">
                  <Space direction="vertical">
                    {step.nextSteps.map((item) => (
                      <>
                        <FunnelStepButton
                          stepKey={[...results.slice(1, i + 1).map((s) => s.title), item.title].join(' > ')}
                          value={item}
                          content={`${item.title} (${item.totalCount})`}
                          button1Label="Event summary details"
                          button1={
                            <Popover trigger="click" content={<EventDetails target={item.title} />}>
                              <Button icon={<MoreOutlined />} />
                            </Popover>
                          }
                          onFilterClick={(_, key) => filterForUserIds(key.toString(), item.matchingUserIds)}
                        />
                      </>
                    ))}
                    <FunnelStepButton
                      stepKey={[...results.slice(1, i + 1).map((s) => s.title), 'drop off'].join(' > ')}
                      value="dropoff"
                      content={`Drop off (${step.dropoffCount})`}
                      disabled
                      onFilterClick={(_, key) => filterForUserIds(key.toString(), step.dropoffUserIds)}
                    />
                    <FunnelStepButton
                      stepKey={[...results.slice(1, i + 1).map((s) => s.title), 'total'].join(' > ')}
                      value="total"
                      content={`Total users in this step (${step.totalCount})`}
                      disabled
                      onFilterClick={(_, key) => filterForUserIds(key.toString(), step.matchingUserIds)}
                    />
                  </Space>
                </Radio.Group>
              </Card>
            </Col>
          )
        })}
      </Row> */}
    </>
  )
}
