use async_graphql::SimpleObject;
use serde::{Deserialize, Serialize};

#[derive(Debug, SimpleObject, Serialize, Deserialize)]
pub struct Role {
    pub id: i32,
    pub name: String,
}

impl PartialEq for Role {
    fn eq(&self, other: &Self) -> bool {
        self.name == other.name
    }
}
