
const {
    StateTransition,
    BehaviorFollowEntity,
    BehaviorLookAtEntity,
    BehaviorGetClosestEntity,
    BehaviorIdle,
    NestedStateMachine,
} = require("mineflayer-statemachine");

function createFollowEntityState(bot, entityFilter = () => true)
{
    const targets = {};

    const enter = new BehaviorIdle();
    const exit = new BehaviorIdle();

    const followEntity = new BehaviorFollowEntity(bot, targets);
    const getClosestPlayer = new BehaviorGetClosestEntity(bot, targets, entityFilter);

    const transitions = [

        new StateTransition({
            parent: enter,
            child: getClosestPlayer,
            shouldTransition: () => true,
        }),

        new StateTransition({
            parent: getClosestPlayer,
            child: followEntity,
            shouldTransition: () => targets.entity !== undefined,
        }),

        new StateTransition({
            parent: getClosestPlayer,
            child: exit,
            shouldTransition: () => targets.entity === undefined,
        }),

        new StateTransition({
            parent: followEntity,
            child: exit,
            shouldTransition: () => followEntity.distanceToTarget() < 2,
        }),

    ];

    return new NestedStateMachine(transitions, enter, exit);
}

module.exports = createFollowEntityState