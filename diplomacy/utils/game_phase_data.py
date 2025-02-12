# ==============================================================================
# Copyright (C) 2019 - Philip Paquette, Steven Bocco
#
#  This program is free software: you can redistribute it and/or modify it under
#  the terms of the GNU Affero General Public License as published by the Free
#  Software Foundation, either version 3 of the License, or (at your option) any
#  later version.
#
#  This program is distributed in the hope that it will be useful, but WITHOUT
#  ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS
#  FOR A PARTICULAR PURPOSE.  See the GNU Affero General Public License for more
#  details.
#
#  You should have received a copy of the GNU Affero General Public License along
#  with this program.  If not, see <https://www.gnu.org/licenses/>.
# ==============================================================================
""" Utility class to save all data related to one game phase (phase name, state, messages and orders). """
from diplomacy.engine.message import Message
from diplomacy.engine.log import Log
from diplomacy.utils import common, strings, parsing
from diplomacy.utils.jsonable import Jsonable
from diplomacy.utils.sorted_dict import SortedDict

MESSAGES_TYPE = parsing.IndexedSequenceType(
    parsing.DictType(int, parsing.JsonableClassType(Message), SortedDict.builder(int, Message)),
    "time_sent",
)
LOGS_TYPE = parsing.IndexedSequenceType(
    parsing.DictType(int, parsing.JsonableClassType(Log), SortedDict.builder(int, Log)), "time_sent"
)


class GamePhaseData(Jsonable):
    """Small class to represent data for a game phase:
    phase name, state, orders, orders results and messages for this phase.
    """

    __slots__ = [
        "name",
        "state",
        "orders",
        "results",
        "messages",
        "logs",
        "stances",
        "order_logs",
        "is_bot",
        "deceiving",
    ]

    model = {
        strings.NAME: str,
        strings.STATE: dict,
        strings.ORDERS: parsing.DictType(str, parsing.OptionalValueType(parsing.SequenceType(str))),
        strings.RESULTS: parsing.DictType(
            str, parsing.SequenceType(parsing.StringableType(common.StringableCode))
        ),
        strings.MESSAGES: MESSAGES_TYPE,
        strings.LOGS: LOGS_TYPE,
        strings.STANCES: parsing.DictType(str, parsing.DictType(str, int)),
        strings.ORDER_LOGS: parsing.DictType(int, str),
        "is_bot": parsing.DictType(str, parsing.DictType(str, bool)),
        "deceiving": parsing.DictType(str, parsing.DictType(str, bool)),
    }

    def __init__(
        self, name, state, orders, results, messages, stances, logs, order_logs, is_bot, deceiving
    ):
        """Constructor."""
        self.name = ""
        self.state = {}
        self.orders = {}
        self.results = {}
        self.messages = {}
        self.logs = {}
        self.order_logs = {}
        self.is_bot = {
            "AUSTRIA": {
                "AUSTRIA": False,
                "ENGLAND": False,
                "FRANCE": False,
                "GERMANY": False,
                "ITALY": False,
                "RUSSIA": False,
                "TURKEY": False,
            },
            "ENGLAND": {
                "AUSTRIA": False,
                "ENGLAND": False,
                "FRANCE": False,
                "GERMANY": False,
                "ITALY": False,
                "RUSSIA": False,
                "TURKEY": False,
            },
            "FRANCE": {
                "AUSTRIA": False,
                "ENGLAND": False,
                "FRANCE": False,
                "GERMANY": False,
                "ITALY": False,
                "RUSSIA": False,
                "TURKEY": False,
            },
            "GERMANY": {
                "AUSTRIA": False,
                "ENGLAND": False,
                "FRANCE": False,
                "GERMANY": False,
                "ITALY": False,
                "RUSSIA": False,
                "TURKEY": False,
            },
            "ITALY": {
                "AUSTRIA": False,
                "ENGLAND": False,
                "FRANCE": False,
                "GERMANY": False,
                "ITALY": False,
                "RUSSIA": False,
                "TURKEY": False,
            },
            "RUSSIA": {
                "AUSTRIA": False,
                "ENGLAND": False,
                "FRANCE": False,
                "GERMANY": False,
                "ITALY": False,
                "RUSSIA": False,
                "TURKEY": False,
            },
            "TURKEY": {
                "AUSTRIA": False,
                "ENGLAND": False,
                "FRANCE": False,
                "GERMANY": False,
                "ITALY": False,
                "RUSSIA": False,
                "TURKEY": False,
            },
        }
        self.deceiving = {}
        super(GamePhaseData, self).__init__(
            name=name,
            state=state,
            orders=orders,
            results=results,
            messages=messages,
            logs=logs,
            stances=stances,
            order_logs=order_logs,
            is_bot=is_bot,
            deceiving=deceiving,
        )
