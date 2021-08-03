import React from 'react'
import cn from 'classnames'
import s from './Input.module.css'

const CpfCnpj = ({
  type = 'tel',
  value = '',
  onChange = () => {},
  className,
  ...props
}) => {
  const rootClassName = cn(s.root, {}, className)
  const TYPES = {
    CPF: '999.999.999-999',
    CNPJ: '99.999.999/9999-99'
  }
  const MAX_LENGTH = clear(TYPES.CNPJ).length

  let val = clear(value)

  if (val) {
    val = applyMask(val, TYPES[getMask(val)])
  }

  function onLocalChange(ev) {
    let value = clear(ev.target.value)
    const mask = getMask(value)

    let nextLength = value.length

    if (nextLength > MAX_LENGTH) return

    value = applyMask(value, TYPES[mask])

    ev.target.value = value

    onChange(ev, mask)
  }

  function getMask(value) {
    return value.length > 11 ? 'CNPJ' : 'CPF'
  }

  function applyMask(value, mask) {
    let result = ''

    let inc = 0
    Array.from(value).forEach((letter, index) => {
      if (!mask[index + inc].match(/[0-9]/)) {
        result += mask[index + inc]
        inc++
      }
      result += letter
    })
    return result
  }

  function clear(value) {
    return value && value.replace(/[^0-9]/g, '')
  }

  return (
    <input
      {...props}
      type={type}
      value={val}
      onChange={onLocalChange}
      className={rootClassName}
    />
  )
}

export default CpfCnpj
