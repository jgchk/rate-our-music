#[derive(thiserror::Error, Debug)]
pub enum Error {
    #[error(transparent)]
    DatabaseError(#[from] sqlx::Error),
    #[error(transparent)]
    RedisError(#[from] redis::RedisError),
    #[error(transparent)]
    JWTError(#[from] jsonwebtoken::errors::Error),
    #[error(transparent)]
    TryFromIntError(#[from] std::num::TryFromIntError),
    #[error("invalid credentials")]
    InvalidCredentials,
    #[error("invalid role {0}")]
    InvalidRole(String),
    #[error("insufficient permissions")]
    InsufficientPermissions,
    #[error("invalid date: year {0:?}, month {1:?}, day {2:?}")]
    InvalidDate(Option<i16>, Option<i16>, Option<i16>),
    #[error("invalid input: {0}")]
    InvalidInput(String),
}

impl warp::reject::Reject for Error {}

impl Into<String> for Error {
    fn into(self) -> String {
        format!("{:?}", self)
    }
}
