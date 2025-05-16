import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS } from '@/constants/Colors';
import { TYPOGRAPHY } from '@/constants/Typography';
import { Award, Clock, Calendar } from 'lucide-react-native';

interface StatCardProps {
  title: string;
  value: string;
  icon: 'award' | 'clock' | 'calendar';
  color: string;
}

export const StatCard: React.FC<StatCardProps> = ({ title, value, icon, color }) => {
  const renderIcon = () => {
    switch (icon) {
      case 'award':
        return <Award size={24} color={color} />;
      case 'clock':
        return <Clock size={24} color={color} />;
      case 'calendar':
        return <Calendar size={24} color={color} />;
      default:
        return null;
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.iconContainer}>
        {renderIcon()}
      </View>
      <Text style={styles.value}>{value}</Text>
      <Text style={styles.title}>{title}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    width: '31%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  iconContainer: {
    marginBottom: 8,
  },
  value: {
    ...TYPOGRAPHY.h3,
    color: COLORS.text.primary,
  },
  title: {
    ...TYPOGRAPHY.caption,
    color: COLORS.text.secondary,
    textAlign: 'center',
    marginTop: 4,
  },
});