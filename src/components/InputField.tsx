import React, { useState } from 'react';
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
  autoCapitalize?: TextInputProps['autoCapitalize'];
  autoCorrect?: boolean;
};

const InputField = ({
  value,
  onChange,
  placeholder,
  keyboardType,
  secure,
  icon,
  rightAccessory,
  autoCapitalize = 'none',
  autoCorrect = false,
}: Props) => {
  const [focused, setFocused] = useState(false);

  return (
    <View
      style={[
        AuthStyles.inputContainer,
        focused && AuthStyles.inputContainerFocused,
      ]}
    >
      {icon ? (
        <Icon
          name={icon}
          size={20}
          color={focused ? '#4f46e5' : '#64748b'}
          style={AuthStyles.inputIcon}
        />
      ) : null}
      <TextInput
        style={AuthStyles.input}
        placeholder={placeholder}
        placeholderTextColor="#94a3b8"
        value={value}
        onChangeText={onChange}
        keyboardType={keyboardType}
        secureTextEntry={!!secure}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        autoCapitalize={autoCapitalize}
        autoCorrect={autoCorrect}
        textContentType={
          keyboardType === 'email-address' ? 'emailAddress' : undefined
        }
      />
      {rightAccessory}
    </View>
  );
};

export default React.memo(InputField);
