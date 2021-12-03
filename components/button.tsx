import { FC } from 'react'

const Button: FC<{ disabled?: boolean; onClick: () => void }> = ({
  children,
  disabled = false,
  onClick,
}) => {
  return (
    <button
      disabled={disabled}
      onClick={onClick}
      className={`mx-2 p-2 rounded-lg${
        disabled
          ? ' bg-gray-200 text-gray-400 cursor-not-allowed'
          : ' bg-gray-100 text-gray-600 hover:bg-gray-200'
      }`}
    >
      {children}
    </button>
  )
}

export default Button
