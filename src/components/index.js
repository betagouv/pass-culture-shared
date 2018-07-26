export * from './hocs'

import BasicInput from './BasicInput'
import CancelButton from './CancelButton'
import CheckboxInput from './CheckboxInput'
import DateInput from './DateInput'
import Field from './Field'
import Form from './Form'
import HiddenInput from './HiddenInput'
import Icon from './Icon'
import NumberInput from './NumberInput'
import PasswordInput from './PasswordInput'
import SelectInput from './SelectInput'
import SubmitButton from './SubmitButton'
import TextareaInput from './TextareaInput'
import TextInput from './TextInput'
import TimeInput from './TimeInput'

Form.WrappedComponent.inputsByType = {
  checkbox: CheckboxInput,
  date: DateInput,
  email: TextInput,
  hidden: HiddenInput,
  number: NumberInput,
  password: PasswordInput,
  select: SelectInput,
  text: TextInput,
  textarea: TextareaInput,
  time: TimeInput,
}

export {
  BasicInput,
  CancelButton,
  CheckboxInput,
  DateInput,
  Field,
  Form,
  HiddenInput,
  Icon,
  NumberInput,
  PasswordInput,
  SelectInput,
  SubmitButton,
  TextareaInput,
  TextInput,
  TimeInput
}
