import CalendarDay from './CalendarDay';
import CalendarMonth from './CalendarMonth';
import CalendarYear from './CalendarYear';
import CalendarWeek from './CalendarWeek';
import './index.scss';

export default Object.assign({}, CalendarDay, {
  Day: CalendarDay,
  Month: CalendarMonth,
  Year: CalendarYear,
  Week: CalendarWeek,
});
