import React from 'react'
import { useState, useEffect } from 'react'

const Time = () => {

    const [dataHora, setDataHora] = useState(new Date());

    useEffect(() => {
        const timerID = setInterval(() => {
        setDataHora(new Date());
        }, 1000);

        return () => clearInterval(timerID);
    }, []);
    
    return (
        <div>
            {dataHora.toLocaleTimeString()} {dataHora.toLocaleDateString()} 
        </div>
    )
}

export default Time