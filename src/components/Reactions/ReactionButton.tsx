import * as React from 'react';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import * as classNames from 'classnames';

import { reactToPost, unreactToPost } from '../../redux/actions/actionCreators';
import { RatifiedPostBody } from '../../redux/models/postBody';
import { State } from '../../redux/models/state';
import { User } from '../../redux/models/user';

import Emoji from './Emoji';
import './reactions.css';

interface ReactionButtonOwnProps {
  post: RatifiedPostBody;
  emojiShortName: string;
}

interface ReactionButtonProps extends ReactionButtonOwnProps {
  reactionCount: number;
  isSelectedByUser: boolean;
  reactToPost: (postId: string, emojiShortName: string) => void;
  unreactToPost: (postId: string) => void;
}

class ReactionButton extends React.Component<ReactionButtonProps> {
  constructor(props: ReactionButtonProps) {
    super(props);

    this.onClick = this.onClick.bind(this);
  }

  render() {
    return (
      <div
        className={classNames('reaction-button', {['selected-reaction-button']: this.props.isSelectedByUser})}
        onClick={this.onClick}
      >
        <Emoji emojiShortName={this.props.emojiShortName} />
        <div>{this.props.reactionCount}</div>
      </div>
    );
  }

  onClick() {
    if (this.props.isSelectedByUser) {
      this.props.unreactToPost(this.props.post.id);
    } else {
      this.props.reactToPost(this.props.post.id, this.props.emojiShortName);
    }
  }
}

const mapStateToProps = (state: State, ownProps: ReactionButtonOwnProps) => {
  const userToReactionMap = ownProps.post.reactionMap;

  let reactionCount = 0;
  Object.keys(userToReactionMap).forEach((userId) => {
    if (userToReactionMap[userId] === ownProps.emojiShortName) {
      reactionCount++;
    }
  });

  // todo: find a way to assert that state.user will not be null
  const usersReaction = userToReactionMap[(state.user as User).id];
  const isSelectedByUser = usersReaction === ownProps.emojiShortName;

  return {
    post: ownProps.post,
    emojiShortName: ownProps.emojiShortName,
    reactionCount,
    isSelectedByUser
  };
};

const mapDispatchToProps = (dispatch: Dispatch<State>) => {
    return {
      reactToPost: (postId: string, emojiShortName: string) => {
        dispatch(reactToPost(postId, emojiShortName));
      },
      unreactToPost: (postId: string) => {
        dispatch(unreactToPost(postId));
      }
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(ReactionButton);
