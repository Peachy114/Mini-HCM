import { round2 } from "./helper.js";
import { formatInTimeZone } from 'date-fns-tz';

const TZ = 'Asia/Manila';

export function computeMetrics(punchIn, punchOut, schedule) {
    const inTime = punchIn.toDate ? punchIn.toDate() : new Date(punchIn);
    const outTime = punchOut.toDate ? punchOut.toDate() : new Date(punchOut);

    const dateStr = formatInTimeZone(inTime, TZ, 'yyyy-MM-dd');
    const schedStart = new Date(`${dateStr}T${schedule.start}:00+08:00`);
    const schedEnd   = new Date(`${dateStr}T${schedule.end}:00+08:00`);

    if (schedEnd <= schedStart) schedEnd.setDate(schedEnd.getDate() + 1);
    
    const totalMins = Math.max(0, Math.round((outTime - inTime) / 60000 ));
    
    // SAFETY CHECK: Max 24 hours
    if (totalMins > 1440) {
        console.error('Shift too long:', totalMins, 'minutes');
        return {
            regularHours: 0,
            overtimeHours: 0,
            nightDiffHours: 0,
            totalWorkHours: 0,
            lateMinutes: 0,
            undertimeMinutes: 0,
        };
    }
    
    const lateMinutes= Math.max(0, Math.round((inTime - schedStart) / 60000));
const undertimeMinutes = Math.max(0, Math.round((schedEnd - outTime)  / 60000));

    const regularStart = inTime > schedStart ? inTime : schedStart;
    const regularEnd = outTime < schedEnd ? outTime : schedEnd;
    const regularMins = Math.max(0, Math.round((regularEnd - regularStart)/ 60000));
    const otMins = outTime > schedEnd ? Math.round((outTime - schedEnd)/ 60000) : 0;

    // Night differential with SAFETY LIMIT
    let ndMins = 0;
    let clockCursor = new Date(inTime);
    let safetyCounter = 0;
    const MAX_MINUTES = 1440; // 24 hours max

    while (clockCursor < outTime) {
        safetyCounter++;
        if (safetyCounter > MAX_MINUTES) {
            console.error('Night diff loop exceeded 24 hours');
            break;
        }

        const hour = parseInt(formatInTimeZone(clockCursor, TZ, 'H'), 10); // Manila hour
        if (hour >= 22 || hour < 6) ndMins++;
        clockCursor = new Date(clockCursor.getTime() + 60000);
    }

    return {
        regularHours: round2(regularMins / 60),
        overtimeHours: round2(otMins / 60),
        nightDiffHours: round2(ndMins / 60),
        totalWorkHours: round2(totalMins /60),
        lateMinutes,
        undertimeMinutes,
    };
}