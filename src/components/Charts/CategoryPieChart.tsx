import React from 'react';
import { View, Text } from 'react-native';
// NOTE: Install chart dependencies:
// yarn add react-native-chart-kit react-native-svg
// or npm install react-native-chart-kit react-native-svg
// For iOS, run pod install in ios/ after installing.

import { PieChart } from 'react-native-chart-kit';
import { Dimensions } from 'react-native';

const screenWidth = Dimensions.get('window').width - 48;

export default function CategoryPieChart({
  data,
}: {
  data: { name: string; value: number; color?: string }[];
}) {
  if (!data || data.length === 0) return <Text>No data</Text>;
  const chartData = data.map(d => ({
    name: d.name,
    population: d.value,
    color: d.color || '#888',
    legendFontColor: '#333',
    legendFontSize: 12,
  }));
  return (
    <View>
      <PieChart
        data={chartData as any}
        width={screenWidth}
        height={220}
        chartConfig={{
          backgroundGradientFrom: '#fff',
          backgroundGradientTo: '#fff',
          color: (opacity = 1) => `rgba(0,0,0, ${opacity})`,
        }}
        accessor="population"
        backgroundColor="transparent"
        paddingLeft="15"
        absolute
      />
    </View>
  );
}
