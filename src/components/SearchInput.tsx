import { TextInput } from "flowbite-react";
import { InputHTMLAttributes } from "react";

interface Input extends InputHTMLAttributes<HTMLInputElement> {
  className?: string;
}

const SearchInput = ({ className, ...input }: Input) => {
  return <TextInput className={className} {...input} />;
};

export default SearchInput;
