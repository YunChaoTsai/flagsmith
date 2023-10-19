import enum


class RelatedObjectType(enum.Enum):
    CHANGE_REQUEST = "Change request"
    EDGE_IDENTITY = "Edge identity"
    ENVIRONMENT = "Environment"
    FEATURE = "Feature"
    FEATURE_STATE = "Feature state"
    GRANT = "Grant"
    GROUP = "Group"
    IMPORT_REQUEST = "Import request"
    PROJECT = "Project"
    SEGMENT = "Segment"
    USER = "User"
