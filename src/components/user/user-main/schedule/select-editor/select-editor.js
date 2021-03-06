import React from "react"
import loadable from "@loadable/component"
import "./select-editor.sass"

const Dropdown = loadable(() => import(/* webpackChunkName: "Dropdown" */"components/dropdown/dropdown"))
//import Dropdown from "components/dropdown/dropdown"

export default class SelectEditor extends React.Component {

    constructor(props) {
        super(props)
        this.state = { }
        this.select = React.createRef()
    }

    handleChange = (_, data) => this.setState({ selected: data.value })

    getValue = () => ({ [this.props.column.key]: this.state.selected })

    getInputNode = () => this.select.current

    render() {
        return (
            <div ref={ this.select } className="dropdown-con">
                <Dropdown placeholder={ this.props.value }
                          options={ [{ key: "", value: "", text: "" }, ...this.props.options] }
                          onChange={ this.handleChange }
                          search
                          defaultValue={ this.props.value }
                />
            </div>
        )
    }
}