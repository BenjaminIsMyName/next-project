import { useState } from "react";

export default function useFormData(inputsDataDefault) {
  const [inputsData, setInputsData] = useState(inputsDataDefault);

  function handleInputChange(event) {
    const { name, value } = event.target;
    setInputsData(prev => ({ ...prev, [name]: value }));
  }

  return { inputsData, setInputsData, handleInputChange };
}
