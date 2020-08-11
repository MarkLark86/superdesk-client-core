// External Modules
import * as React from 'react';

// Types
import {ISuperdesk} from 'superdesk-api';
import {MODAL_TYPES} from '../interfaces';

// UI
import {Dropdown, ButtonGroup, SubNav} from 'superdesk-ui-framework/react';
import {IMenuGroup} from 'superdesk-ui-framework/react/components/Dropdown';
import {HeaderPanel, LayoutContainer, MainPanel} from '../ui';
import {getManageSetsModalComponent} from '../components/sets/manageSetsModal';

interface IState {
    currentModal: MODAL_TYPES;
}

export function getSamsWorkspaceComponent(superdesk: ISuperdesk) {
    const {gettext} = superdesk.localization;
    const ManageSetsModal = getManageSetsModalComponent(superdesk);

    return class SamsWorkspace extends React.Component<{}, IState> {
        constructor(props: any) {
            super(props);

            this.state = {
                currentModal: MODAL_TYPES.NONE,
            };

            this.closeModal = this.closeModal.bind(this);
        }

        showModal(modalType: MODAL_TYPES) {
            this.setState({currentModal: modalType});
        }

        closeModal() {
            this.setState({currentModal: MODAL_TYPES.NONE});
        }

        getMenuActions(): Array<IMenuGroup> {
            const actions: Array<any> = [];

            if (superdesk.privileges.hasPrivilege('sams_manage')) {
                actions.push({
                    label: gettext('Manage Sets'),
                    icon: 'folder-open',
                    onSelect: () => this.showModal(MODAL_TYPES.MANAGE_SETS),
                });
            }

            return actions.length === 0 ?
                [] :
                [{
                    type: 'group',
                    label: gettext('Actions'),
                    items: [
                        'divider',
                        ...actions,
                    ],
                }];
        }

        renderModal() {
            switch (this.state.currentModal) {
            case MODAL_TYPES.MANAGE_SETS:
                return (
                    <ManageSetsModal closeModal={this.closeModal}/>
                );
            }

            return null;
        }

        render() {
            const actions = this.getMenuActions();

            return (
                <React.Fragment>
                    <div className="sd-page">
                        <LayoutContainer>
                            <HeaderPanel>
                                <SubNav zIndex={2}>
                                    {actions.length === 0 ? null : (
                                        <ButtonGroup align="right">
                                            <Dropdown items={this.getMenuActions()}>
                                                <button className="sd-navbtn">
                                                    <i className="icon-dots-vertical"/>
                                                </button>
                                            </Dropdown>
                                        </ButtonGroup>
                                    )}
                                </SubNav>
                                <SubNav zIndex={1}/>
                            </HeaderPanel>
                            <MainPanel className="sd-padding--2">
                                <div className="sd-margin--1"/>
                            </MainPanel>
                        </LayoutContainer>
                    </div>
                    {this.renderModal()}
                </React.Fragment>
            );
        }
    };
}