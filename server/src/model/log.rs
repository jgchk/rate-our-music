use async_graphql::{Enum, Object};

pub struct Log {
    pub log_id: i32,
    pub log_scope: String,
    pub log_environment: LogEnvironment,
    pub log_level: LogLevel,
    pub log_message: String,
    pub log_data: Option<String>,
}

#[derive(sqlx::Type, Debug, Clone, Copy, Enum, Eq, PartialEq)]
#[sqlx(type_name = "log_environment", rename_all = "SCREAMING_SNAKE_CASE")]
pub enum LogEnvironment {
    Development,
    Production,
    Unknown,
}
#[derive(sqlx::Type, Debug, Clone, Copy, Enum, Eq, PartialEq)]
#[sqlx(type_name = "log_level", rename_all = "SCREAMING_SNAKE_CASE")]
pub enum LogLevel {
    Critical,
    Error,
    Warning,
    Info,
    Debug,
}

#[Object]
impl Log {
    async fn id(&self) -> i32 {
        self.log_id
    }

    async fn scope(&self) -> String {
        (&self.log_scope).to_string()
    }

    async fn environment(&self) -> LogEnvironment {
        self.log_environment
    }

    async fn level(&self) -> LogLevel {
        self.log_level
    }

    async fn message(&self) -> String {
        (&self.log_message).to_string()
    }
}
