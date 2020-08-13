import React from "react"

import "./circle-button.sass"

const CircleButton = ({ className = "", img, onClick }) => (
    <img className={`circle-button ${className}`} src={img} onClick={onClick} />
)

export default CircleButton
