import React, { useEffect, useState, useContext } from 'react';
import { startShift , endShift, getShift} from '../api';
import {UserBusinessContext} from '../context/UserBusinessContext';




const ShiftButton = () =>{
    const [shift, setShift] = useState(null);  // Active shift if it exists
    const [timer, setTimer] = useState(0);     // Timer in seconds
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        // Fetch current active shift
        const fetchActiveShift = async () => {
            const response = await getShift (`/shifts`);
            if (response.data.shift) {
                setShift(response.data.shift); 
                startTimer(new Date(response.data.shift.startTime));
            }
        };

        fetchActiveShift();
    }, []);

    // Start timer for ongoing shift
    const startTimer = (startTime) => {
        const calculateTimeElapsed = () => {
            const now = new Date();
            const timeElapsed = Math.floor((now - new Date(startTime)) / 1000);
            setTimer(timeElapsed);
        };

        calculateTimeElapsed();
        const interval = setInterval(calculateTimeElapsed, 1000);
        return () => clearInterval(interval);  // Clear interval when component unmounts
    };
    const { user } = useContext(UserBusinessContext);

    const handleStartShift = async () => {
        setLoading(true);
        const response = await startShift ( user.username);
        setShift(response.data.shift);
        setLoading(false);
        startTimer(new Date(response.data.shift.startTime));
    };

    const handleEndShift = async () => { 
        setLoading(true);
        await endShift( { shiftId: shift.shiftId,username: user.username});
        setShift(null);
        setTimer(0);  // Reset timer
        setLoading(false);
    };

    return (
        <div>
            {shift ? (
                <div>
                    <p>Shift Active: {Math.floor(timer / 3600)}h {Math.floor((timer % 3600) / 60)}m {timer % 60}s</p>
                    <button onClick={handleEndShift} disabled={loading}>
                        End Shift
                    </button>
                </div>
            ) : (
                <button onClick={handleStartShift} disabled={loading}>
                    Start Shift
                </button>
            )}
        </div>
    );
}

export default ShiftButton;