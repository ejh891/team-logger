import * as React from 'react';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { 
  Button,
  Col,
  DropdownButton,
  FormControl,
  FormGroup,
  InputGroup,
  MenuItem,
  Row,
} from 'react-bootstrap';
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
  hackerEmoji: string;
  availableEmojis: string[];

  constructor(props: ReactionBarProps) {
    super(props);
    
    this.state = {
      showHackerReaction: false,
      hackerInput: ''
    };

    this.hackerEmoji = ':smirk:';

    this.availableEmojis = [
      ':joy:',
      ':heart:',
      ':tada:',
      ':fearful:',
      ':dumpling:',
      this.hackerEmoji
    ];

    this.hackerReactionButtonOnClick = this.hackerReactionButtonOnClick.bind(this);
    this.hackerReactionOnKeyUp = this.hackerReactionOnKeyUp.bind(this);
    this.hackerReactionOnChange = this.hackerReactionOnChange.bind(this);
    this.submitHackerReaction = this.submitHackerReaction.bind(this);
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
                      if (shortName === this.hackerEmoji) {
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
            <FormGroup className="hacker-reaction">
              <InputGroup bsSize="large">
                <InputGroup.Addon className="hacker-reaction-addon">
                  <Emoji style={{ height: '22px', width: '22px' }} emojiShortName={this.hackerEmoji} />
                </InputGroup.Addon>
                <FormControl
                  className="hacker-reaction-input"
                  type="text"
                  onChange={this.hackerReactionOnChange}
                  onKeyUp={this.hackerReactionOnKeyUp}
                />
                <InputGroup.Button>
                  <Button className="hacker-reaction-button" onClick={this.hackerReactionButtonOnClick}>Hack</Button>
                </InputGroup.Button>
              </InputGroup>
            </FormGroup>
          </Col>
        }
      </Row>
    );
  }

  submitHackerReaction() {
      if (emojione.shortnameToImage(this.state.hackerInput) !== this.state.hackerInput) {
        this.props.reactToPost(this.props.post.id, this.state.hackerInput);
      }
      this.setState({ showHackerReaction: false });
    }

  hackerReactionButtonOnClick() {
    this.submitHackerReaction();
  }

  hackerReactionOnKeyUp(event: React.KeyboardEvent<FormControl>) {
    if (event.key === 'Enter') {
      this.submitHackerReaction();
    }
  }

  hackerReactionOnChange(event: React.FormEvent<FormControl>) {
    this.setState({ hackerInput: (event.target as HTMLInputElement).value });
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
