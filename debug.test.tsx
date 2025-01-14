import {screen} from '@testing-library/react'

test('basic render test', () => {
    const element = document.createElement('div')
    element.textContent = 'Hello World'
    document.body.appendChild(element)
    expect(screen.getByText('Hello World')).toBeInTheDocument()
})