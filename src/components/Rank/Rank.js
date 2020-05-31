import React from 'react';

class Rank extends React.Component {
  constructor() {
    super(); 
    this.state = {
      emoji: ''
    }
  }

  componentDidMount() {
    this.generateEmoji(this.props.entries)
  }

  componentDidUpdate(prevProps) {
    if (prevProps.entries !== this.props.entries) {
      this.generateEmoji(this.props.entries)
    }
  }

  generateEmoji = (entries) => {
    console.log(`https://js5je7wuaj.execute-api.us-east-1.amazonaws.com/prod/rank?rank=${entries}`)
    fetch(`https://js5je7wuaj.execute-api.us-east-1.amazonaws.com/prod/rank?rank=${entries}`)
      .then(res => res.json())
      .then(data => this.setState({ emoji: data.input }))
      .catch(console.log)
  }

  render () {
    const {name, entries} = this.props;
    return (
      <div>
        <div className="white f3">
          {`${name} , your current entry count is...`}
        </div>
        <div className="white f1">
          {entries}
        </div>
        <div className="white f3">
          {`Rank Badge: ${this.state.emoji}`}
        </div>
      </div>
    );
  }
}

export default Rank;
