import React from "react"
import { Dropdown } from "semantic-ui-react"

import "./select-editor.sass"

export default class SelectEditor extends React.Component {

    constructor(props) {
        super(props)
        this.state = { }
        this.select = React.createRef()
    }

    handleChange = (_, data) => this.setState({ selected: data.value })

    getValue = () => ({ [this.props.column.key]: this.state.selected })

    getInputNode = () => document.querySelector(".dropdown-con")

    render() {
        return (
            <div className="dropdown-con" tabIndex="-1">
                <Dropdown placeholder={ this.props.value }
                          options={ [{ key: "", value: "", text: "" }, ...this.props.options] }
                          search
                          selection
                          onChange={ this.handleChange }
                          defaultValue={ this.props.value }
                />
            </div>
        )
    }
}