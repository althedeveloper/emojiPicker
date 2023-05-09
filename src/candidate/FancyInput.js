import React, { useState, useRef, forwardRef } from 'react';
import emojisData from './emojis.json';
import { Input } from 'baseui/input';
import {StatefulPopover} from 'baseui/popover';
import {StatefulMenu} from 'baseui/menu';

const FancyInput = () => {
  const [value, setValue] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [options, setOptions] = useState([]);
  const [hasColon, setHasColon] = useState(false);
  const [emojiSearchTerm, setEmojiSearchTerm] = useState('')

  const ref = useRef(null);

  const handleInputChange = (event) => {
    const inputValue = event.target.value;
    
    // Check if the user has typed a colon followed by at least two characters
    const colonRegex = /:[\w\d]{2,}/g;
    const matches = inputValue.match(colonRegex);

    if (matches) {
        const searchText = matches[0].substring(1).toLowerCase(); // Remove the colon from the search text
        setEmojiSearchTerm(searchText)
        const filteredOptions = emojisData.filter((emoji) =>
          emoji.name.toLowerCase().includes(searchText)
        );

        setHasColon(true)
        setOptions(filteredOptions);
        setIsOpen(true);        
    } 
    if (!inputValue || !matches ) {
      setEmojiSearchTerm('')
      setHasColon(false)
      setIsOpen(false);
      setOptions([]);
    }
    setValue(inputValue);
  };
  const handleOptionClick = (event) => {
    const colonIndex = value.lastIndexOf(':');
    let string = event.item.code
    const newValue =
      value.substring(0, colonIndex) + `${String.fromCodePoint.apply(String, string.split(" "))} ` + value.substring(colonIndex + event.item.code.length + 2);
      setOptions([]);
      setHasColon(false)
      setValue(newValue);
      setIsOpen(false);

  };

  // needs work
  const handleKeyDown = (event) => {
    // If the spacebar is pressed after the colon and two alphanumeric characters
    if (hasColon && emojiSearchTerm && event.key === ' ') {
      setEmojiSearchTerm('')
      setIsOpen(false);
      setHasColon(false)
      setOptions([])
    }
  };
 

  const MyInput = forwardRef(function MyInput(props, ref) {
    const { ...otherProps } = props;
    return (
      <Input {...otherProps} ref={ref} />
    )
  })

  return (
    <>
      <MyInput 
        type="text"
        autoFocus 
        ref={ref} 
        value={value} 
        onKeyDown={handleKeyDown}
        onChange={handleInputChange}
         />
      <StatefulPopover 
        isOpen={isOpen && hasColon} 
        accessibilityType={'tooltip'}
        placement="bottomLeft" 
        onClickOutside={() => setIsOpen(false)}
        >
          {
            options.length 
            ? (
              <StatefulMenu  
                items={options}
                onItemSelect={(item) => handleOptionClick(item)}
                overrides={{
                  List: {
                    style: {
                      height: '250px',
                      width: '100%',
                    },
                  },
                  Option: {
                    props: {
                      getItemLabel: item => String.fromCodePoint.apply(String, item.code.split(" ")) + ' ' + item.name,
                    },
                  },
                }}
                />
              )
            : (
                <></>
            )
          }
         </StatefulPopover>

    </>
  );
}

export { FancyInput }