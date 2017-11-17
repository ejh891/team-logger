import * as React from 'react';
import * as classNames from 'classnames';
import * as emojione from 'emojione';

import './reactions.css';

interface ReactionButtonProps {
  emojiShortName: string;
  reactionCount: number;
  isSelectedByUser: boolean;
}

class ReactionButton extends React.Component<ReactionButtonProps> {
  render() {
    return (
      <div className={classNames('reaction-button', {['selected-reaction-button']: this.props.isSelectedByUser})}>
        <img
          className="reaction-button-image" 
          src={this.getImageSrcFromShortname(this.props.emojiShortName)}
          alt={this.props.emojiShortName}
        />
        <div>{this.props.reactionCount}</div>
      </div>
    );
  }

  getImageSrcFromShortname(shortname: string) {
    const img = emojione.shortnameToImage(shortname);
    
    const srcRegex = new RegExp(/src="(.*)"/);
    const match = srcRegex.exec(img);

    if (match !== null && match.length >= 2) {
      return match[1];
    } else {
      return '';
    }
  }
}

export default ReactionButton;
