'use client'

import React, { useState } from 'react'
import { DateRangePicker } from "@nextui-org/date-picker";
import { parseDate, getLocalTimeZone } from "@internationalized/date";
import { useDateFormatter } from "@react-aria/i18n";
import { RangeValue, CalendarDate } from '@nextui-org/react';
import { useWidth } from '@/providers/WidthProvider';

const FilterSelect = () => {
  const [date, setDate] = useState({
    start: parseDate(new Date().toISOString().split('T')[0]),
    end: parseDate(new Date().toISOString().split('T')[0]),
  })

  const { width } = useWidth()

  const handleDateChange = (value: RangeValue<CalendarDate>) => {
    setDate(value)
  }

  return (
    <DateRangePicker
      label='Filter by range'
      value={date}
      onChange={handleDateChange}
      labelPlacement='outside-left'
      visibleMonths={width > 768 ? 2 : 1}
      classNames={{
        label: 'text-sm font-medium'
      }}
    />
  );
}

export default FilterSelect