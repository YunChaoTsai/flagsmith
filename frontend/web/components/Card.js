import { PureComponent } from 'react'

const Card = class extends PureComponent {
  static displayName = 'Card'

  render() {
    return (
      <div
        className={`panel-card panel panel-default ${
          this.props.className || ''
        }`}
      >
        <div className='panel-content py-3'>{this.props.children}</div>
      </div>
    )
  }
}

Card.displayName = 'Card'

Card.propTypes = {
  children: OptionalNode,
  icon: OptionalString,
  title: oneOfType([OptionalObject, OptionalString]),
}

module.exports = Card
