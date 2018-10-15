import BasicInput from './BasicInput'
import CancelButton from './CancelButton'
import CheckboxInput from './CheckboxInput'
import DateInput from './DateInput'
import Field from './Field'
import FileInput from './FileInput'
import Form from './Form'
import HiddenInput from './HiddenInput'
import NumberInput from './NumberInput'
import PasswordInput from './PasswordInput'
import SelectInput from './SelectInput'
import SubmitButton from './SubmitButton'
import TextareaInput from './TextareaInput'
import TextInput from './TextInput'
import TimeInput from './TimeInput'


Form.inputsByType = {
  checkbox: CheckboxInput,
  date: DateInput,
  email: TextInput,
  file: FileInput,
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
  FileInput,
  Form,
  HiddenInput,
  NumberInput,
  PasswordInput,
  SelectInput,
  SubmitButton,
  TextareaInput,
  TextInput,
  TimeInput,
}
