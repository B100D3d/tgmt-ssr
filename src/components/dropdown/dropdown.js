import React from "react"
import { Dropdown } from "semantic-ui-react"

import "./dropdown.sass"


const MyDropdown = ({ options, onChange, defaultValue, placeholder, search, multiple }) => (
    <Dropdown
        placeholder={ placeholder }
        options={ options }
        search={ search }
        selection
        multiple={ multiple }
        onChange={ onChange }
        defaultValue={ defaultValue }
    />
)

export default MyDropdown