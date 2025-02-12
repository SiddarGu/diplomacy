// ==============================================================================
// Copyright (C) 2019 - Philip Paquette, Steven Bocco
//
//  This program is free software: you can redistribute it and/or modify it under
//  the terms of the GNU Affero General Public License as published by the Free
//  Software Foundation, either version 3 of the License, or (at your option) any
//  later version.
//
//  This program is distributed in the hope that it will be useful, but WITHOUT
//  ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS
//  FOR A PARTICULAR PURPOSE.  See the GNU Affero General Public License for more
//  details.
//
//  You should have received a copy of the GNU Affero General Public License along
//  with this program.  If not, see <https://www.gnu.org/licenses/>.
// ==============================================================================
/*eslint no-unused-vars: ["error", { "args": "none" }]*/
import { RESPONSES } from "../communication/responses";

/** Default response manager. **/
function defaultResponseManager(context, response) {
    if (RESPONSES.isOk(response)) return null;
    if (RESPONSES.isUniqueData(response)) return response.data;
    return response;
}

/** Response managers. **/
export const RESPONSE_MANAGERS = {
    get_all_possible_orders: defaultResponseManager,
    get_available_maps: defaultResponseManager,
    get_playable_powers: defaultResponseManager,
    list_games: defaultResponseManager,
    get_games_info: defaultResponseManager,
    process_game: defaultResponseManager,
    query_schedule: defaultResponseManager,
    save_game: defaultResponseManager,
    set_dummy_powers: defaultResponseManager,
    set_grade: defaultResponseManager,
    synchronize: defaultResponseManager,
    send_order_log: defaultResponseManager,
    create_game: function (context, response) {
        return context.newGame(response.data);
    },
    delete_account: function (context, response) {
        context.removeChannel();
    },
    delete_game: function (context, response) {
        context.deleteGame();
    },
    get_phase_history: function (context, response) {
        for (let phaseData of response.data) {
            context.game.local.extendPhaseHistory(phaseData);
        }
        return response.data;
    },
    join_game: function (context, response) {
        return context.newGame(response.data);
    },
    leave_game: function (context, response) {
        context.deleteGame();
    },
    logout: function (context, response) {
        context.removeChannel();
    },
    send_recipient_annotation: function (context, response) {
        const annotation = context.request.annotation;
        context.game.local.addRecipientAnnotation(annotation);
    },
    send_stance: function (context, response) {
        const powerName = context.request.power_name;
        const stance = context.request.stance;
        context.game.local.addStance(powerName, stance);
    },
    send_is_bot: function (context, response) {
        const powerName = context.request.power_name;
        const isBot = context.request.is_bot;
        context.game.local.addIsBot(powerName, isBot);
    },
    send_commentary_durations: function (context, response) {
        const durations = context.request.durations;
        context.game.local.addCommentaryDurations(durations);
    },
    send_deceiving: function (context, response) {
        const controlledPower = context.request.controlled_power;
        const targetPower = context.request.target_power;
        const deceiving = context.request.deceiving;

        context.game.local.addIsBot(controlledPower, targetPower, deceiving);
    },
    send_game_message: function (context, response) {
        const message = context.request.message;
        message.time_sent = response.data;
        context.game.local.addMessage(message);
    },
    send_log_data: function (context, response) {
        const message = context.request.log;
        message.time_sent = response.data;
        context.game.local.addLog(message);
    },
    send_order_suggestions: function (context, response) {
        const power = context.request.power;
        const suggestions = context.request.suggestions;
        context.game.local.addOrderSuggestions(power, suggestions);
    },
    set_game_state: function (context, response) {
        context.game.local.setPhaseData({
            name: context.request.state.name,
            state: context.request.state,
            orders: context.request.orders,
            messages: context.request.messages,
            results: context.request.results,
            logs: context.request.logs,
        });
    },
    set_game_status: function (context, response) {
        context.game.local.setStatus(context.request.status);
    },
    set_orders: function (context, response) {
        const orders = context.request.orders;
        if (context.game.local.isPlayerGame(context.request.game_role))
            context.game.local.setOrders(context.request.game_role, orders);
        else context.game.local.setOrders(context.request.power_name, orders);
    },
    clear_orders: function (context, response) {
        context.game.local.clearOrders(context.request.power_name);
    },
    clear_units: function (context, response) {
        context.game.local.clearUnits(context.request.power_name);
    },
    clear_centers: function (context, response) {
        context.game.local.clearCenters(context.request.power_name);
    },
    set_wait_flag: function (context, response) {
        const wait = context.request.wait;
        if (context.game.local.isPlayerGame(context.request.game_role))
            context.game.local.setWait(context.request.game_role, wait);
        else context.game.local.setWait(context.request.power_name, wait);
    },
    set_comm_status: function (context, response) {
        const commStatus = context.request.comm_status;
        if (context.game.local.isPlayerGame(context.request.game_role))
            context.game.local.setCommStatus(context.request.game_role, commStatus);
        else context.game.local.setCommStatus(context.request.power_name, commStatus);
    },
    vote: function (context, response) {
        context.game.local.getRelatedPower().vote = context.request.vote;
    },
    sign_in: function (context, response) {
        return context.newChannel(context.request.username, response.data);
    },
    handleResponse: function (context, response) {
        if (!RESPONSE_MANAGERS.hasOwnProperty(context.request.name))
            throw new Error("No response handler available for request " + context.request.name);
        const handler = RESPONSE_MANAGERS[context.request.name];
        return handler(context, response);
    },
};
