import React from "react"
import { Dropdown } from "semantic-ui-react"

import "./dropdown.sass"


const MyDropdown = ({ options, onChange, defaultValue, placeholder }) => (
    <Dropdown
        placeholder={ placeholder }
        options={ options }
        search
        selection
        onChange={ onChange }
        defaultValue={ defaultValue }
    />
)

export default MyDropdown