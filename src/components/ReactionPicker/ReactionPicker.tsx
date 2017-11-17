import * as React from 'react';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { Row, Col } from 'react-bootstrap';
import * as classNames from 'classnames';

import { State } from '../../redux/models/state';
import { User } from '../../redux/models/user';

import ReactionButton from './ReactionButton';

import './reactionPicker.css';

interface ReactionPickerProps {
    postId: string;
    user: User;
}

class ReactionPicker extends React.Component<ReactionPickerProps> {
  availableEmojis: string[];

  constructor(props: ReactionPickerProps) {
    super(props);
    
    this.availableEmojis = [
      ':thumbsup:',
      ':100:',
      ':joy:',
      ':heart:',
      ':ghost:',
      ':tada:'
    ];
  }

  render() {
    return (
      <Row>
        <Col xs={12}>
          <div className="reaction-bar">
          <div className={classNames('reaction-button', 'add-new-reaction-button')}>+</div>
            {this.availableEmojis.map((shortName) => {
              return (
                <ReactionButton
                  key={shortName}
                  emojiShortName={shortName}
                  reactionCount={Math.floor(Math.random() * 100)}
                  isSelectedByUser={Math.random() > 0.5}
                />
              );
            })}
          </div>
        </Col>
      </Row>
    );
  }
}

const mapStateToProps = (state: State) => {
  return {
    user: state.user,
  };
};

const mapDispatchToProps = (dispatch: Dispatch<State>) => {
    return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(ReactionPicker);
