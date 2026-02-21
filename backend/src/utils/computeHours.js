import { differenceInMInutes, max, min, parse, addMinutes, isAfter, isBefore, setHours, setMinutes } from "date-fns";
import { utcToZonedTime } from "date-fns-tz";

export const NightDifferential = (inTime, outTime, timezone) => {
  //22:00 - 23:59
  const startND = utcToZonedTime(new Date(inTime), timezone);
  startND.setHours(22, 0,0,0);
  const endND = utcToZonedTime(new Date(inTime), timezone);
  endND.setHours(23,59,59,999); 

  //00:00 - 6:00
  const startND1 = utcToZonedTime(new Date(inTime), timezone);
  const endND1 = utcToZonedTime(new Date(inTime), timezone)
  startND1.setHours(0, 0, 0, 0);
  endND1.setHours(6, 0, 0, 0);

  let minutes = 0;

  const overlapStartOne = max([inTime, startND]);

}