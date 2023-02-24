import { useEffect, useState } from 'react';
import React from "react";
import axios from "axios";

export default function Funnel({funnelPath, funnelEvents, handleFunnelClick}) {
    const client = axios.create({
        baseURL: "http://localhost:8080",
        headers: {"Access-Control-Allow-Origin": "*"}
    });

    console.log("rendering", funnelPath, funnelEvents);
    return (
    <div>
        {funnelPath.map((p, i) => {
            const subPath = funnelPath.slice(0, i+1)
            const key = subPath.join("|")
            const subEvents = funnelEvents[key] || {};
            console.log("drawing", subPath, key, funnelEvents);
            return (
            <> {Object.keys(subEvents).map((event) => {
                const eventCount = subEvents[event]
                const buttonId = key + event
                const nextPath = [...subPath, event]
                return (<>
                    <button key={buttonId} onClick={() => handleFunnelClick(nextPath)}>
                        {event}({eventCount})
                    </button><br></br>
                </>)
            })}
            </>)
        })}
    </div>
    )
    
}
