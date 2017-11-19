import * as React from 'react';

import EmojiUtil from '../../utils/emojiUtil';

import './reactions.css';

interface EmojiProps {
  emojiShortName: string;
  style?: {};
}

class ReactionButton extends React.Component<EmojiProps> {
  constructor(props: EmojiProps) {
    super(props);

    this.getSrc = this.getSrc.bind(this);
  }

  render() {
    return (
      <img
        style={this.props.style}
        className="reaction-emoji-image" 
        src={this.getSrc()}
        alt={this.props.emojiShortName}
      />
    );
  }

  getSrc() {
    return EmojiUtil.getImageSrcByShortName(this.props.emojiShortName);
  }
}

export default ReactionButton;
