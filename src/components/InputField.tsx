import React from 'react';
import { View, TextInput, TextInputProps } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import AuthStyles from './AuthStyles';

type Props = {
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
  keyboardType?: TextInputProps['keyboardType'];
  secure?: boolean;
  icon?: string;
  rightAccessory?: React.ReactNode;
};

const InputField = ({
  value,
  onChange,
  placeholder,
  keyboardType,
  secure,
  icon,
  rightAccessory,
}: Props) => {
  return (
    <View style={AuthStyles.inputContainer}>
      {icon ? (
        <Icon
          name={icon}
          size={20}
          color="#6b7280"
          style={AuthStyles.inputIcon}
        />
      ) : null}
      <TextInput
        style={AuthStyles.input}
        placeholder={placeholder}
        placeholderTextColor="#9ca3af"
        value={value}
        onChangeText={onChange}
        keyboardType={keyboardType}
        secureTextEntry={!!secure}
      />
      {rightAccessory}
    </View>
  );
};

export default React.memo(InputField);
