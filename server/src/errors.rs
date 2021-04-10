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
    #[error("insufficient permissions")]
    InsufficientPermissions,

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
