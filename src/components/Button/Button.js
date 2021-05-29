import React, { useEffect } from 'react'
import './styles.css'

const Button = props => {
    const { size = 'big', color = 'blue', arrow = false, fontSize = '18px', margin = '0', onClick, text } = props;
    return <div className={`button button-${size} button-${color} ${arrow ? 'button-arrow' : ''}`} style={{fontSize, margin}} onClick={onClick}>{text}</div>
}

export default Button