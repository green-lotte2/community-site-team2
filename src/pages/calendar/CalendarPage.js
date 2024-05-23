import React, { useEffect, useState } from 'react';
import DefaultLayout from '../../layouts/DefaultLayout';
import 'react-calendar/dist/Calendar.css';
import "../../styles/calendar.scss";
import CalendarComponent from '../../components/calendar/CalendarComponent';


const CalendarPage = () => {

    return (
        <DefaultLayout>
            <div className='calendar'>
                <CalendarComponent />
            </div>
        </DefaultLayout>
    )
}

export default CalendarPage