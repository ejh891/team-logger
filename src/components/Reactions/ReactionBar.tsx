import * as React from 'react';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { Row, Col, DropdownButton, MenuItem } from 'react-bootstrap';
import * as classNames from 'classnames';
import * as emojione from 'emojione';

import { State } from '../../redux/models/state';
import { User } from '../../redux/models/user';
import { RatifiedPostBody } from '../../redux/models/postBody';
import { reactToPost } from '../../redux/actions/actionCreators';

import ReactionButton from './ReactionButton';
import Emoji from './Emoji';

import './reactions.css';

interface ReactionBarOwnProps {
  post: RatifiedPostBody;
}

interface ReactionBarProps extends ReactionBarOwnProps {
    existingReactionTypes: string[];
    user: User;
    reactToPost: (postId: string, emojiShortName: string) => void;
}

interface ReactionBarState {
  showHackerReaction: boolean;
  hackerInput: string;
}

class ReactionBar extends React.Component<ReactionBarProps, ReactionBarState> {
  availableEmojis: string[];

  constructor(props: ReactionBarProps) {
    super(props);
    
    this.state = {
      showHackerReaction: false,
      hackerInput: ''
    };

    this.availableEmojis = [
      ':joy:',
      ':heart:',
      ':tada:',
      ':fearful:',
      ':dumpling:',
      ':man_mage_tone1:'
    ];

    this.hackerReactionOnKeyUp = this.hackerReactionOnKeyUp.bind(this);
    this.hackerReactionOnChange = this.hackerReactionOnChange.bind(this);
  }

  render() {
    return (
      <Row>
        <Col xs={12}>
          <div className="reaction-bar">
            <DropdownButton
              id={`add-reaction-dropdown-${this.props.post.id}`}
              className={classNames('reaction-button', 'add-new-reaction-button')}
              title="+"
              noCaret={true}
              dropup={true}
            >
              {this.availableEmojis.map((shortName) => {
                return (
                  <MenuItem
                    className="reaction-menu-item"
                    key={shortName}
                    eventKey={shortName}
                    onClick={() => {
                      if (shortName === ':man_mage_tone1:') {
                        this.setState({ showHackerReaction: true });
                      } else {
                        this.props.reactToPost(this.props.post.id, shortName);
                      }
                    }}
                  >
                    <Emoji emojiShortName={shortName} />
                  </MenuItem>
                );
              })}
            </DropdownButton>
            <div className="reactions">
              {this.props.existingReactionTypes.map((shortName) => {
                return (
                  <ReactionButton
                    key={shortName}
                    post={this.props.post}
                    emojiShortName={shortName}
                  />
                );
              })}
            </div>
          </div>
        </Col>
        {this.state.showHackerReaction && 
          <Col xs={12}>
            <input 
              className="hacker-reaction"
              type="text"
              onKeyUp={this.hackerReactionOnKeyUp}
              onChange={this.hackerReactionOnChange}
            />
          </Col>
        }
      </Row>
    );
  }

  hackerReactionOnKeyUp(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key === 'Enter') {
      if (emojione.shortnameToImage(this.state.hackerInput) !== this.state.hackerInput) {
        this.props.reactToPost(this.props.post.id, this.state.hackerInput);
      }
      this.setState({ showHackerReaction: false });
    }
  }

  hackerReactionOnChange(event: React.FormEvent<HTMLInputElement>) {
    this.setState({ hackerInput: event.currentTarget.value });
  }
}

const mapStateToProps = (state: State, ownProps: ReactionBarOwnProps) => {
  const reactionMap = ownProps.post.reactionMap || {};
  const existingReactionTypes = new Set();

  Object.keys(reactionMap).forEach((userId) => {
    existingReactionTypes.add(reactionMap[userId]);
  });

  return {
    user: state.user,
    existingReactionTypes: Array.from(existingReactionTypes)
  };
};

const mapDispatchToProps = (dispatch: Dispatch<State>) => {
    return {
      reactToPost: (postId: string, emojiShortName: string) => {
        dispatch(reactToPost(postId, emojiShortName));
      },
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(ReactionBar);
