package schema

import (
	"entgo.io/ent"
	"entgo.io/ent/schema/edge"
	"entgo.io/ent/schema/field"
	"entgo.io/ent/schema/index"
	"time"
)

// Ride holds the schema definition for the Ride entity.
type Ride struct {
	ent.Schema
}

// Fields of the Ride.
func (Ride) Fields() []ent.Field {
	return []ent.Field{
		field.String("id").
			Unique().
			Immutable(),
		field.String("driver_id").
			NotEmpty(),
		field.String("vehicle_id").
			Optional(),
		field.String("type").
			Default("carpool"), // carpool, bus
		field.String("ride_type").
			Default("one_time"), // one_time, recurring
		field.JSON("recurrence", map[string]interface{}{}).
			Optional(),
		field.Time("departure_time"),
		field.Time("arrival_time").
			Optional().
			Nillable(),
		field.Int("duration_minutes").
			Optional().
			Nillable().
			Positive(),
		field.String("origin_city").
			NotEmpty(),
		field.String("origin_address").
			NotEmpty(),
		field.String("origin_location_point").
			Optional(),
		field.String("destination_city").
			NotEmpty(),
		field.String("destination_address").
			NotEmpty(),
		field.String("destination_location_point").
			Optional(),
		field.Int64("price_amount").
			Positive(),
		field.String("price_currency").
			Default("IDR"),
		field.Int("available_seats").
			Positive(),
		field.Int("total_seats").
			Positive(),
		field.JSON("amenities", map[string]interface{}{}).
			Optional(),
		field.JSON("stops", []interface{}{}).
			Optional(),
		field.Bool("instant_confirmation").
			Default(true),
		field.String("cancellation_policy").
			Default("never_cancels"),
		field.Text("description").
			Optional(),
		field.String("status").
			Default("active"), // active, cancelled, completed
		field.Time("created_at").
			Default(time.Now).
			Immutable(),
		field.Time("updated_at").
			Default(time.Now).
			UpdateDefault(time.Now),
	}
}

// Edges of the Ride.
func (Ride) Edges() []ent.Edge {
	return []ent.Edge{
		edge.From("driver", User.Type).
			Ref("rides").
			Field("driver_id").
			Unique().
			Required(),
		edge.From("vehicle", Vehicle.Type).
			Ref("rides").
			Field("vehicle_id").
			Unique(),
		edge.To("bookings", Booking.Type),
	}
}

// Indexes of the Ride.
func (Ride) Indexes() []ent.Index {
	return []ent.Index{
		index.Fields("origin_city", "destination_city", "departure_time"),
		index.Fields("driver_id"),
		index.Fields("status"),
	}
}
