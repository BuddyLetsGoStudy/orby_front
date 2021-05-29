import React, { useEffect } from 'react'
import './styles.css'

const Button = props => {
    const { size = 'big', color = 'blue', arrow = false, fontSize = '18px', margin = '0', onClick, text } = props;
    return <div className={`button button-${size} ${arrow ? 'button-arrow' : ''}`} style={{fontSize, margin}} onClick={onClick}><div className={`button-${color} button-colored`}/><div className={`button-${color}-hovered button-colored`}/><div className={'button-text'}>{text}</div></div>
}

export default Button