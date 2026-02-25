import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';

export default function DateRangeFilter({
  onChange,
}: {
  onChange: (from?: Date, to?: Date) => void;
}) {
  const [from, setFrom] = useState<Date | undefined>(undefined);
  const [to, setTo] = useState<Date | undefined>(undefined);
  const [showFrom, setShowFrom] = useState(false);
  const [showTo, setShowTo] = useState(false);

  return (
    <View style={styles.row}>
      <TouchableOpacity onPress={() => setShowFrom(true)} style={styles.btn}>
        <Text>{from ? from.toLocaleDateString() : 'From'}</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => setShowTo(true)} style={styles.btn}>
        <Text>{to ? to.toLocaleDateString() : 'To'}</Text>
      </TouchableOpacity>
      {showFrom && (
        <DateTimePicker
          value={from || new Date()}
          mode="date"
          display="default"
          onChange={(e, d) => {
            setShowFrom(false);
            if (d) {
              setFrom(d);
              onChange(d, to);
            }
          }}
        />
      )}
      {showTo && (
        <DateTimePicker
          value={to || new Date()}
          mode="date"
          display="default"
          onChange={(e, d) => {
            setShowTo(false);
            if (d) {
              setTo(d);
              onChange(from, d);
            }
          }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row' },
  btn: {
    padding: 8,
    backgroundColor: '#f3f4f6',
    borderRadius: 8,
    marginRight: 8,
  },
});
