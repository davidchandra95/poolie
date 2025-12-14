package schema

import (
	"entgo.io/ent"
	"entgo.io/ent/schema/edge"
	"entgo.io/ent/schema/field"
	"entgo.io/ent/schema/index"
	"time"
)

// Booking holds the schema definition for the Booking entity.
type Booking struct {
	ent.Schema
}

// Fields of the Booking.
func (Booking) Fields() []ent.Field {
	return []ent.Field{
		field.String("id").
			Unique().
			Immutable(),
		field.String("ride_id").
			NotEmpty(),
		field.String("passenger_id").
			NotEmpty(),
		field.String("status").
			Default("pending"), // pending, confirmed, rejected, cancelled, completed
		field.Int("passenger_count").
			Positive(),
		field.Int64("total_price_amount").
			Positive(),
		field.String("total_price_currency").
			Default("IDR"),
		field.Text("message").
			Optional(),
		field.Text("driver_response_message").
			Optional(),
		field.Time("created_at").
			Default(time.Now).
			Immutable(),
		field.Time("responded_at").
			Optional().
			Nillable(),
		field.Time("updated_at").
			Default(time.Now).
			UpdateDefault(time.Now),
	}
}

// Edges of the Booking.
func (Booking) Edges() []ent.Edge {
	return []ent.Edge{
		edge.From("ride", Ride.Type).
			Ref("bookings").
			Field("ride_id").
			Unique().
			Required(),
		edge.From("passenger", User.Type).
			Ref("bookings").
			Field("passenger_id").
			Unique().
			Required(),
	}
}

// Indexes of the Booking.
func (Booking) Indexes() []ent.Index {
	return []ent.Index{
		index.Fields("ride_id"),
		index.Fields("passenger_id"),
		index.Fields("status"),
	}
}
