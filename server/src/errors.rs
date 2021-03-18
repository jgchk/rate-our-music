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
    #[error("ArtistInput must have either `id` or `name`")]
    InvalidArtistInput,

    #[error("username must be {0} to {1} characters")]
    InvalidUsernameLength(i32, i32),
    #[error("password must be {0} to {1} characters")]
    InvalidPasswordLength(i32, i32),
}

impl warp::reject::Reject for Error {}

impl Into<String> for Error {
    fn into(self) -> String {
        format!("{:?}", self)
    }
}
