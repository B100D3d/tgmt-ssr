import React from "react"

export default class SelectEditor extends React.Component {

    constructor(props) {
        super(props)
        this.state = { selected: {} }
        this.select = React.createRef()
    }

    handleChange = e => this.setState({ selected: e.target })

    getValue = () => ({ [this.props.column.key]: this.state.selected.value })

    getInputNode = () => this.select.current

    render() {
        return (
            <select ref={ this.select } onChange={ this.handleChange }
                    defaultValue={ this.props.value } className="select-editor" name="grid-editor">
                { this.props.options.map(opt =>
                    <option key={ opt.id } value={ opt.value } > { opt.value } </option>
                )}
            </select>
        )
    }
}