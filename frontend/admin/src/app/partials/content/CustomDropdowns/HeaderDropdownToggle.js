import React from "react";

/*export default class HeaderDropdownToggle extends React.Component {


  constructor(props, context) {
    super(props, context);
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick(e) {
    e.preventDefault();
    this.props.onClick(e);
  }


  render() {
    return (
      <div
        className="kt-header__topbar-wrapper"
        onClick={this.handleClick}
      >
        {this.props.children}
      </div>
    );
  }
}*/

export const HeaderDropdownToggle = React.forwardRef(({ children, onClick }, ref) => (

  <div ref={ref}
        className="kt-header__topbar-wrapper"
         onClick={e => {
      e.preventDefault();
      onClick(e);
    }}
      >
        {children}
      </div>
));