import React from "react";
import { Button } from 'antd';

export default function Funnel({funnelPath, funnelEvents, handleFunnelClick}) {
    console.log("rendering", funnelPath, funnelEvents);
    function getFunnelEvents(path) {
        const key = path.join("|")
        return funnelEvents[key] || {};
    }

    return (
        <div>
            {funnelPath.map((p, i) => {
                const subPath = funnelPath.slice(0, i+1)
                const key = subPath.join("|")
                const subEvents = funnelEvents[key] || [];
                console.log("drawing", subPath, key, subEvents);
                return (
                    <>
                    <h3>Step {i+1}: {subPath.at(-1)}</h3>
                    {subEvents.map((event) => {
                        const name = event.event
                        const userIds = event.userIds 
                        const eventCount = userIds.length
                        const buttonId = key + name
                        const nextPath = [...subPath, name]
                        console.log(name, eventCount, buttonId, nextPath);
                        return (
                            <>
                                <div>
                                    <Button key={buttonId} onClick={() => handleFunnelClick(nextPath)}>
                                        {name}({eventCount})
                                    </Button>
                                    <textarea rows="10" cols="40">{userIds.join("\n")}</textarea>
                                </div>
                                <br></br>
                            </>
                        )}
                    )}
                    <hr />
                    </>
                )}
            )}
        </div>
    )
}
